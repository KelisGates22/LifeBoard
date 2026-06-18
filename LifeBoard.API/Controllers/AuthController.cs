using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LifeBoard.API.Data;
using LifeBoard.API.Models;

namespace LifeBoard.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {

        #region Fields and Constructor

        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        #endregion

        #region Endpoints

        /**
         * POST api/auth/register
         * Registers a new user with a hashed password.
         * Validates that the email is unique before creating the user.
         */
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest("Email already in use.");

            
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }

        /**
         * POST api/auth/login
         * Authenticates a user and returns a JWT token.
         */
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized("Invalid email or password.");

            
            var token = GenerateJwtToken(user);

            return Ok(new { token });
        }

        #endregion

        #region Helper Methods

        /**
         * Generates a JWT token for the authenticated user.
         * Includes claims for user ID, username, and email.
         * Token is valid for 24 hours.
         */
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        #endregion


    }


    #region Request Models

    public record RegisterRequest(string Username, string Email, string Password);
    public record LoginRequest(string Email, string Password);

    #endregion


}