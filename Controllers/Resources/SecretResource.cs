namespace vega.Controllers.Resources
{
    public class SecretResource
    {
        public SecretResource(string FirstName, string LastName)
        {
            this.FirstName = FirstName;
            this.LastName = LastName;
        }

        public string FirstName;
        public string LastName;
    }
}