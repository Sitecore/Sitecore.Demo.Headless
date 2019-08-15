using System;
using System.IO;

namespace Sitecore.HabitatHome.Fitness.Foundation.Analytics.Deploy
{
    class Program
    {
        static void Main(string[] args)
        {
            string name;
            string json = ModelFactory.CreateDeploymentJson(out name);
            string fileName = $"{name}.json";

            Console.WriteLine("Running deploy.exe");

            foreach (var path in args)
            {
                string fullpath = Path.Combine(path, fileName);
                Console.WriteLine($"Deploy.exe -> Copying model to {fullpath}");
                File.WriteAllText(fullpath, json);
            }
        }
    }
}
