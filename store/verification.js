export const state = () => {
  return {
    verified: false
  }
}
export const mutations = {
  setVerified (state, payload) {
    state.verified = payload
  }
}

export const actiosn = {
  setVerified ({ commit }, payload) {
    commit('setVerified', payload)
  }
}
