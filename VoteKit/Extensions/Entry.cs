using System.Linq;
using VoteKit.Data.Models;

namespace VoteKit.Extensions
{
  public static class EntryExtensions
  {
    public static IQueryable<Entry> WhereVisible(this IQueryable<Entry> me)
    {
      return me.Where(e => !e.IsArchived && !e.IsDeleted);
    }
    
    public static IQueryable<Entry> WherePubliclyVisible(this IQueryable<Entry> me)
    {
      return me.WhereVisible().Where(e => !e.IsPrivate);
    }
  }
}
