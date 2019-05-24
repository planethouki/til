import moment from '~/plugins/moment'

export const state = () => ({
  isLoggedIn: false,
  user: null
});

export const getters = {
  isLoggedIn: (state) => state.isLoggedIn,
  user: (state) => state.user ? Object.assign({ likes: [] }, state.user) : null
};

export const mutations = {
  setUser(state, { user }) {
    state.user = user;
    state.isLoggedIn = true
  }
};

export const actions = {
  async login({ commit }, { id }) {
    const user = await this.$axios.$get(`/users/${id}.json`);
    // eslint-disable-next-line
    console.log(user);
    if (!user.id) throw new Error('Invalid user');
    commit('setUser', { user })
  },
  async register({ commit }, { id }) {
    const payload = {};
    payload[id] = { id };
    await this.$axios.$patch(`/users.json`, payload);
    const user = await this.$axios.$get(`/users/${id}.json`);
    if (!user.id) throw new Error('Invalid user');
    commit('setUser', { user })
  },
  async addLikeLogToUser({ commit }, { user, post }) {
    user.likes.push({
      created_at: user.id,
      post_id: post.id
    });
    const newUser = await this.$axios.$put(`/users/${user.id}.json`, user);
    commit('setUser', { user: newUser })
  }
};
