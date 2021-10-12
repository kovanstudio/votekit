using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using Microsoft.AspNetCore.DataProtection.Repositories;
using Microsoft.EntityFrameworkCore;
using VoteKit.Data;
using VoteKit.Data.Models;

namespace VoteKit.Web.Services
{
  public class DataProtectionKeyRepository : IXmlRepository
  {
    private readonly IDbContextFactory<VotekitCtx> _db;

    public DataProtectionKeyRepository(IDbContextFactory<VotekitCtx> db)
    {
      _db = db;
    }

    public IReadOnlyCollection<XElement> GetAllElements()
    {
      using var db = _db.CreateDbContext();

      return db.DataProtectionKeys.AsNoTracking()
        .Where(x => x.Owner == "dashboard" && x.Xml != null && x.Xml != "")
        .ToList()
        .Select(row => XElement.Parse(row.Xml!))
        .ToList()
        .AsReadOnly();
    }

    public void StoreElement(XElement element, string friendlyName)
    {
      using var db = _db.CreateDbContext();

      var newKey = new DataProtectionKey()
      {
        Owner = "dashboard",
        FriendlyName = friendlyName,
        Xml = element.ToString(SaveOptions.DisableFormatting)
      };

      db.DataProtectionKeys.Add(newKey);
      db.SaveChanges();
    }
  }
}
