using System;
using System.Collections.Specialized;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;

namespace VoteKit.Services.Implementations;

public class S3FileStoreOptions
{
  public string Region { get; set; } = null!;
  public string Bucket { get; set; } = null!;
  public string? Prefix { get; set; }
}

public class S3FileStore : IFileStore
{
  public class FileMetadata : IFileMetadata
  {
    public string FullPath { get; init; }
    public long Size { get; init; }
    public DateTime? LastModification { get; init; }
  }

  private readonly IAmazonS3 _amazonS3;
  private readonly S3FileStoreOptions _options;

  public S3FileStore(IConfiguration configuration)
  {
    _options = configuration.GetSection("Storage").Get<S3FileStoreOptions>();
    _amazonS3 = new AmazonS3Client(RegionEndpoint.GetBySystemName(_options.Region));
  }

  public async Task<IFileMetadata> GetMetadataAsync(string fullPath, CancellationToken cancellationToken = default)
  {
    if (fullPath.StartsWith("/")) fullPath = fullPath.Substring(1);

    try
    {
      var res = await _amazonS3.GetObjectMetadataAsync(new GetObjectMetadataRequest
      {
        BucketName = _options.Bucket,
        Key = Path.Join(_options.Prefix, fullPath)
      }, cancellationToken);

      return new FileMetadata
      {
        FullPath = fullPath,
        Size = res.ContentLength,
        LastModification = res.LastModified
      };
    }
    catch (AmazonS3Exception ex) when (ex.ErrorCode == "NoSuchBucket" || ex.ErrorCode == "NotFound")
    {
      throw new FileNotFoundException();
    }
  }

  public async Task<Stream> GetAsync(string fullPath, CancellationToken cancellationToken = default)
  {
    if (fullPath.StartsWith("/")) fullPath = fullPath.Substring(1);

    try
    {
      var res = await _amazonS3.GetObjectAsync(new GetObjectRequest
      {
        BucketName = _options.Bucket,
        Key = Path.Join(_options.Prefix, fullPath)
      });

      return res.ResponseStream;
    }
    catch (AmazonS3Exception ex) when (ex.ErrorCode == "NoSuchBucket" || ex.ErrorCode == "NotFound")
    {
      throw new FileNotFoundException();
    }
  }

  public async Task PutAsync(string fullPath, Stream file, CancellationToken cancellationToken = default)
  {
    if (fullPath.StartsWith("/")) fullPath = fullPath.Substring(1);

    await _amazonS3.PutObjectAsync(new PutObjectRequest
    {
      BucketName = _options.Bucket,
      Key = Path.Join(_options.Prefix, fullPath),
      InputStream = file
    }, cancellationToken);
  }
}
