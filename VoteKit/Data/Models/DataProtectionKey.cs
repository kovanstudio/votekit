
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VoteKit.Data.Models
{
  [Table("data_protection_keys")]
  public class DataProtectionKey
  {
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("owner")]
    public string Owner { get; set; } = null!;

    [Column("friendly_name")]
    public string? FriendlyName { get; set; }

    [Column("xml")]
    public string? Xml { get; set; }
  }
}
