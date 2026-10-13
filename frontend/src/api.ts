import { BookingsApi, Configuration, MeetingTypesApi } from './generated/api'

const configuration = new Configuration({ basePath: '/api' })

export const meetingTypesApi = new MeetingTypesApi(configuration)
export const bookingsApi = new BookingsApi(configuration)
