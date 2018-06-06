using System;

namespace Nukkumatti.Web.Data.Entities
{
    public class Situation
    {
        public string Id { get; set; }
        public int Count { get; set; }
        public EventType LastEventType { get; set; }
        public DateTime Time { get; set; }
    }
}