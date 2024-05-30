namespace app_server.Utils
{
    public class OperationResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }

        public static OperationResult SuccessResult() => new OperationResult { Success = true };
        public static OperationResult FailResult(string message) => new OperationResult { Success = false, ErrorMessage = message };
    }

    public class OperationResult<T> where T : class
    {
        public bool Success { get; set; }
        public T Data { get; set; }
        public string ErrorMessage { get; set; }

        public static OperationResult<T> FailResult(string message)
        {
            return new OperationResult<T> { Success = false, ErrorMessage = message };
        }

        public static OperationResult<T> SuccessResult(T data = null)
        {
            return new OperationResult<T> { Success = true, Data = data };
        }
    }
}
