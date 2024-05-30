using app_server.Controllers;
using app_server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace app_server.Utils
{
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

            // If token is valid and user is authorized, add the student ID to HttpContext for later use
            context.HttpContext.Items["StudentId"] = tokenData.Item1;
        }
    }
}
