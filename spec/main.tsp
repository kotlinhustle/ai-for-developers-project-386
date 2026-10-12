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

model MeetingTypeCreate {
  @minLength(1)
  name: string;
  description: string;
  @minValue(1)
  durationMinutes: int32;
}

model Problem {
  title: string;
  status: int32;
  detail: string;
}

model MeetingTypeCreated {
  @statusCode _: 201;
  @body meetingType: MeetingType;
}

model ValidationFailed {
  @statusCode _: 422;
  @body problem: Problem;
}

@tag("MeetingTypes")
@route("/meeting-types")
interface MeetingTypes {
  @get
  list(): MeetingType[];

  @post
  create(@body payload: MeetingTypeCreate): MeetingTypeCreated | ValidationFailed;
}
