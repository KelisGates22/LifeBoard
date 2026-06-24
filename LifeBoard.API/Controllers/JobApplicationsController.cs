using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using LifeBoard.API.Data;
using LifeBoard.API.Models;

namespace LifeBoard.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class JobApplicationsController : ControllerBase
    {
        #region Fields and Constructor
        private readonly AppDbContext _context;

        public JobApplicationsController(AppDbContext context)
        {
            _context = context;
        }

        #endregion

        #region Endpoints

        /**
         * GET api/jobapplications
         * Retrieves all job applications for the authenticated user.
         */
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var jobs = await _context.JobApplications
                .Where(j => j.UserId == userId)
                .OrderByDescending(j => j.AppliedDate)
                .ToListAsync();

            return Ok(jobs);
        }

        /**
         * GET api/jobapplications/5
         * Retrieves a specific job application by ID for the authenticated user.
         */
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var job = await _context.JobApplications
                .FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId);

            if (job == null) return NotFound();

            return Ok(job);
        }

        /**
         * POST api/jobapplications
         * Creates a new job application for the authenticated user.
         */
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] JobApplicationRequest request)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var job = new JobApplication
            {
                UserId = userId.Value,
                Company = request.Company,
                Role = request.Role,
                Status = request.Status ?? "Applied",
                JobUrl = request.JobUrl,
                Notes = request.Notes,
                AppliedDate = request.AppliedDate ?? DateTime.UtcNow
            };

            _context.JobApplications.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = job.Id }, job);
        }

        /**
         * PUT api/jobapplications/5
         * Updates an existing job application for the authenticated user.
         */
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] JobApplicationRequest request)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var job = await _context.JobApplications
                .FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId);

            if (job == null) return NotFound();

            job.Company = request.Company;
            job.Role = request.Role;
            job.Status = request.Status ?? job.Status;
            job.JobUrl = request.JobUrl;
            job.Notes = request.Notes;
            job.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(job);
        }

        /**
         * DELETE api/jobapplications/5
         * Deletes a specific job application by ID for the authenticated user.
         */ 
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var job = await _context.JobApplications
                .FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId);

            if (job == null) return NotFound();

            _context.JobApplications.Remove(job);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        #endregion

        #region Helper Methods
        
        /**
        * Retrieves the user ID from the JWT claims. Returns null if not found or invalid. 
        */
        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        #endregion


    }

    #region Request Models

    public record JobApplicationRequest(
        string Company,
        string Role,
        string? Status,
        string? JobUrl,
        string? Notes,
        DateTime? AppliedDate
    );

    #endregion


}