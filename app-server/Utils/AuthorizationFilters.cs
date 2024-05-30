using app_server.Controllers;
using app_server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace app_server.Utils
{
    public class AuthorizeGeneralUser : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var user = context.HttpContext.User;
            if (user == null || !user.Identity!.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var tokenData = UserController.ExtractUserIdAndJWTToken(user);
            if (tokenData == null || tokenData?.Item1 == null || tokenData?.Item2 == null)
            {
                context.Result = new UnauthorizedObjectResult("Invalid token.");
                return;
            }

            context.HttpContext.Items["UserId"] = tokenData.Item1;
        }
    }

    public class AuthorizeStudent: ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var user = context.HttpContext.User;
            if (user == null || !user.Identity!.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var tokenData = UserController.ExtractUserIdAndJWTToken(user);
            if (tokenData == null || tokenData?.Item1 == null || tokenData.Item2 != UserType.Student)
            {
                context.Result = new UnauthorizedObjectResult("Invalid token or user is not a student.");
                return;
            }

            context.HttpContext.Items["StudentId"] = tokenData.Item1;
        }
    }

    public class AuthorizeTeacher : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var user = context.HttpContext.User;
            if (user == null || !user.Identity!.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var tokenData = UserController.ExtractUserIdAndJWTToken(user);
            if (tokenData == null || tokenData?.Item1 == null || tokenData.Item2 != UserType.Teacher)
            {
                context.Result = new UnauthorizedObjectResult("Invalid token or user is not a teacher.");
                return;
            }

            context.HttpContext.Items["TeacherId"] = tokenData.Item1;
        }
    }
}
