import "@typespec/http";
import "@typespec/openapi";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@service(#{ title: "Календарь звонков" })
namespace Calendar;

model MeetingType {
  id: string;
  name: string;
  description: string;
  durationMinutes: int32;
}

@tag("MeetingTypes")
@route("/meeting-types")
interface MeetingTypes {
  @get
  list(): MeetingType[];
}
