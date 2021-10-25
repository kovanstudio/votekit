using System;
using System.Collections.Specialized;
using System.IO;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace VoteKit.Services.Implementations;

public class FileSystemFileStore : IFileStore
{
  public class FileMetadata : IFileMetadata
  {
    public string FullPath { get; init; }
    public long Size { get; init; }
    public DateTime? LastModification { get; init; }
  }

  private readonly string _rootPath;

  public FileSystemFileStore(IConfiguration configuration)
  {
    _rootPath = configuration["DataDir"];
  }

  public Task<IFileMetadata> GetMetadataAsync(string fullPath, CancellationToken cancellationToken = default)
  {
    var path = Path.Join(_rootPath, fullPath);
    var info = new FileInfo(path);

    if (!info.Exists)
      throw new FileNotFoundException();

    return Task.FromResult((IFileMetadata)new FileMetadata
    {
      FullPath = fullPath,
      Size = info.Length,
      LastModification = info.LastWriteTimeUtc
    });
  }

  public Task<Stream> GetAsync(string fullPath, CancellationToken cancellationToken = default)
  {
    var path = Path.Join(_rootPath, fullPath);

    if (!File.Exists(path))
      throw new FileNotFoundException();

    return Task.FromResult((Stream)File.OpenRead(path));
  }

  public async Task PutAsync(string fullPath, Stream file, CancellationToken cancellationToken = default)
  {
    var path = Path.Join(_rootPath, fullPath);

    if (!Directory.Exists(Path.GetDirectoryName(path)))
      Directory.CreateDirectory(Path.GetDirectoryName(path));

    await using var outfile = File.OpenWrite(path);
    await file.CopyToAsync(outfile, cancellationToken);
  }
}
