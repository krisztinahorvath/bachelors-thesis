namespace app_server.Utils
{
    public class OperationResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }

        public static OperationResult SuccessResult() => new OperationResult { Success = true };
        public static OperationResult FailResult(string message) => new OperationResult { Success = false, ErrorMessage = message };
    }
}
