import { FETCH_USER_RESUME_SUCCESS } from '../const'

const state = {
  basics: {
    name: '',
    label: '',
    picture: '',
    email: '',
    phone: '',
    website: '',
    blog: '',
    brief: '',
    summary: '',
    location: {
      city: '',
      countryCode: ''
    },
    profiles: []
  },
  works: [],
  educations: [],
  skills: [],
  projects: {
    opensource: [],
    contribution: []
  },
  writing: [],
  speaking: [],
  languages: []
}

const mutations = {
  [FETCH_USER_RESUME_SUCCESS] (state, resume) {
    state.basics = { ...resume.basics }
    state.works = [ ...resume.works ]
    state.educations = [ ...resume.educations ]
    state.skills = [ ...resume.skills ]
    state.projects = { ...resume.projects }
    state.writing = [ ...resume.writing ]
    state.speaking = [ ...resume.speaking ]
    state.languages = [ ...resume.languages ]
  }
}

export default {
  state,
  mutations
}
