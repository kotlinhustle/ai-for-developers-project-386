import { Configuration, MeetingTypesApi } from './generated/api'

export const meetingTypesApi = new MeetingTypesApi(new Configuration({ basePath: '/api' }))
