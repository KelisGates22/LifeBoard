using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using OpenAI.Chat;
using LifeBoard.API.Data;

namespace LifeBoard.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CoverLetterController : ControllerBase
    {
        #region Fields and Constructor

        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;


        public CoverLetterController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        #endregion

        #region Endpoints

        /**
         * POST api/coverletter/generate/{jobId}
         * Generates a cover letter for the specified job application using OpenAI's GPT model.
         * Requires the user to be authenticated and the job application to belong to the user.
         * Hardcoded candidate background is used for the cover letter generation(temp).
         */
        [HttpPost("generate/{jobId}")]
        public async Task<IActionResult> Generate(int jobId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var job = await _context.JobApplications
                .FirstOrDefaultAsync(j => j.Id == jobId && j.UserId == userId);

            if (job == null) return NotFound();

            var apiKey = _configuration["OpenAI:ApiKey"];
            var model = _configuration["OpenAI:Model"] ?? "gpt-4o-mini";

            var client = new ChatClient(model, apiKey);

            var today = DateTime.UtcNow.ToString("MMMM dd, yyyy");

            var prompt = $@"
            Write a professional, concise cover letter for the following job application.

            Company: {job.Company}
            Role: {job.Role}

            Candidate information:
            Name: Kelis Gates
            Email: kelisgates0425@gmail.com
            Phone: 470-925-9883
            Location: Newnan, GA
            Date: {today}

            Candidate background:
            - Computer Science graduate (May 2026) from University of West Georgia
            - Full-stack development experience with ASP.NET Core, PostgreSQL, React, and TypeScript
            - Built and deployed LifeBoard, a full stack job application tracker, on Railway
            - Computing Teaching Assistant, debugging student code and teaching OOP concepts
            - Undergraduate Research Assistant, presented SDR research at NCUR 2026
            - CompTIA Network+ certified

            Important instructions:
            - Do NOT use any placeholder brackets like [Your Name] or [Date]
            - Use the candidate's real name and contact info provided above
            - Write it as a finished, ready to send letter
            - Keep the tone professional but personable
            - Keep it under 300 words
            ";

            var completion = await client.CompleteChatAsync(prompt);
            var coverLetter = completion.Value.Content[0].Text;

            return Ok(new { coverLetter });
        }

        #endregion

        #region Helper Methods

        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        #endregion
    }
}