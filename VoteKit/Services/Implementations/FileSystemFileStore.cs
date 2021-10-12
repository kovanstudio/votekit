using System;
using System.Collections.Specialized;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace VoteKit.Services.Implementations
{
  public class FileSystemFileStore : IFileStore
  {
    private readonly string _rootPath;

    public FileSystemFileStore(IConfiguration configuration, IWebHostEnvironment host)
    {
      _rootPath = configuration["DataDir"] ?? Path.Combine(host.ContentRootPath, "data");
      
      if (!Directory.Exists(_rootPath))
        Directory.CreateDirectory(_rootPath);
    }
    
    public async Task Write(string key, Stream file, NameValueCollection? metadata = null)
    {
      var path = Path.Join(_rootPath, key);
      var mdpath = path + ".metadata.json";
      
      if (!Directory.Exists(Path.GetDirectoryName(path)))
        Directory.CreateDirectory(Path.GetDirectoryName(path)!);

      if (metadata is { Count: > 0 })
      {
        var jsonMetatada = JsonSerializer.Serialize(metadata);
        await File.WriteAllTextAsync(mdpath, jsonMetatada);
      }
      
      await using var outfile = File.OpenWrite(path);
      await file.CopyToAsync(outfile);
    }

    public async Task<NameValueCollection> ReadMetadata(string key)
    {
      var mdpath = Path.Join(_rootPath, key) + ".metadata.json";

      if (!File.Exists(mdpath))
        return new NameValueCollection();

      var allText = await File.ReadAllTextAsync(mdpath);
      var metadata = JsonSerializer.Deserialize<NameValueCollection>(allText);

      return metadata ?? new NameValueCollection();
    }

    public Task<Stream> OpenRead(string key)
    {
      var path = Path.Join(_rootPath, key);

      if (!File.Exists(path))
        throw new ArgumentException("File not found");
      
      return Task.FromResult((Stream)File.OpenRead(path));
    }
  }
}
