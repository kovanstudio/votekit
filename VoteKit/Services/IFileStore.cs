using System;
using System.Collections.Specialized;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace VoteKit.Services;

public interface IFileMetadata
{
  string FullPath { get; }
  long Size { get; }
  DateTime? LastModification { get; }
}

public interface IFileStore
{
  Task<IFileMetadata> GetMetadataAsync(string fullPath, CancellationToken cancellationToken = default);
  Task<Stream> GetAsync(string fullPath, CancellationToken cancellationToken = default);
  Task PutAsync(string fullPath, Stream file, CancellationToken cancellationToken = default);
}
