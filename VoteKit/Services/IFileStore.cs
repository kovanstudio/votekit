using System.Collections.Specialized;
using System.IO;
using System.Threading.Tasks;

namespace VoteKit.Services
{
  public interface IFileStore
  {
    Task Write(string key, Stream file, NameValueCollection? metadata = null);

    Task<NameValueCollection> ReadMetadata(string key);
    Task<Stream> OpenRead(string key);
  }
}
