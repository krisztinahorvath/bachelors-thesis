﻿using app_server.Models;
using app_server.Models.DTOs;
using app_server.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace app_server.Services
{
    public class AssignmentService
    {
        private readonly StudentsRegisterContext _context;
        private readonly Validate _validate;

        public AssignmentService(StudentsRegisterContext context, Validate validate)
        {
            _context = context;
            _validate = validate;
        }

        // GET ASSIGNMENT BY ID
        public async Task<ActionResult<AssignmentDTO>?> GetAssignmentById(long id)
        {
            if (_context.Assignments == null)
                return null;

            var assignment = await _context.Assignments.FirstOrDefaultAsync(x => x.Id == id);

            if (assignment == null)
                return null;

            return AssignmentToDTO(assignment);
        }

        // GET ALL ASSIGNMENTS AT COURSE
        public async Task<ActionResult<IEnumerable<AssignmentDTO>>?> GetAllAssignmentsAtCourse(long courseId)
        {
            if (_context.Assignments == null)
            {
                return null;
            }

            return await _context.Assignments
                .Where(a => a.CourseId == courseId)
                .OrderBy(a => a.DueDate)
                .Select(x => AssignmentToDTO(x)).ToListAsync();
        }

        // GET ALL ASSIGNMENT NAMES AT COURSE
        public async Task<ActionResult<IEnumerable<AssignmentNameDTO>>?> GetAllAssignmentNamesAtCourse(long courseId)
        {
            if (_context.Assignments == null)
            {
                return null;
            }

            return await _context.Assignments
                .Where(a => a.CourseId == courseId)
                .Select(x => AssignmentNameToDTO(x)).ToListAsync();
        }

        // CREATE ASSIGNMENT
        public async Task<OperationResult<AssignmentDTO>?> CreateAssignment(AssignmentDTO assignmentDTO)
        {
            // validate fields
            var isAssignmentValid = _validate.ValidateAssignmentFields(assignmentDTO);
            if (isAssignmentValid != "")
                return OperationResult<AssignmentDTO>.FailResult(isAssignmentValid);

            if (_context.Assignments == null)
            {
                return null;
            }

            Assignment assignment = new Assignment
            {
                Name = assignmentDTO.Name,
                Description = assignmentDTO.Description,
                DueDate = assignmentDTO.DueDate,
                CourseId = assignmentDTO.CourseId,
                Weight = assignmentDTO.Weight
            };

            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();

            return OperationResult<AssignmentDTO>.SuccessResult(AssignmentToDTO(assignment));
        }

        // UPDATE ASSIGNMENT
        public async Task<OperationResult> PutAssignments(long id, AssignmentDTO assignmentDTO, long teacherId)
        {
            // validate fields
            var isAssignmentValid = _validate.ValidateAssignmentFields(assignmentDTO);
            if (isAssignmentValid != "")
                return OperationResult.FailResult(isAssignmentValid);

            // make sure the person updating the course is a teacher at that course
            if (!_context.CourseTeachers.Any(t => t.TeacherId == teacherId && t.CourseId == assignmentDTO.CourseId))
            {
                return OperationResult.FailResult("You can't update assignments for courses that you aren't a teacher for");
            }

            var assignment = await _context.Assignments.FindAsync(id);

            if (assignment == null)
            {
                return OperationResult.FailResult("The assignmnet doesn't exist");
            }

            assignment.Name = assignmentDTO.Name;
            assignment.Description = assignmentDTO.Description;
            assignment.DueDate = assignmentDTO.DueDate;
            assignment.Weight = assignmentDTO.Weight;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AssignmentExists(id))
                {
                    return OperationResult.FailResult("");
                }
                else
                {
                    throw;
                }
            }

            return OperationResult.SuccessResult();
        }

        // DELETE ASSIGNMENT
        public async Task<OperationResult> DeleteAssignment(long id, long teacherId)
        {
            if (_context.Assignments == null)
            {
                return OperationResult.FailResult("No assignments exist in the database");
            }

            var assignment = await _context.Assignments.FindAsync(id);
            if (assignment == null)
            {
                return OperationResult.FailResult("Assignment doesn't exist.");
            }

            // make sure the person deleting the course is a teacher at that course
            if (!_context.CourseTeachers.Any(t => t.TeacherId == teacherId && t.CourseId == assignment.CourseId))
            {
                return OperationResult.FailResult("You can't delete courses that you aren't a teacher for");
            }

            _context.Assignments.Remove(assignment);
            await _context.SaveChangesAsync();

            return OperationResult.SuccessResult();
        }

        private bool AssignmentExists(long id)
        {
            return (_context.Assignments?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        public static AssignmentDTO AssignmentToDTO(Assignment assignment)
        {
            return new AssignmentDTO
            {
                Id = assignment.Id,
                Name = assignment.Name,
                Description = assignment.Description,
                DueDate = assignment.DueDate.ToLocalTime(),
                Weight = assignment.Weight,
                CourseId = assignment.CourseId
            };
        }

        private static AssignmentNameDTO AssignmentNameToDTO(Assignment assignment)
        {
            return new AssignmentNameDTO
            {
                Id = assignment.Id,
                Name = assignment.Name,
                Weight = assignment.Weight,
            };
        }
    }
}
