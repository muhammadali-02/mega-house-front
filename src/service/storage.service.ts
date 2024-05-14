const TOKEN = 'token'
const THEME = 'theme'
const USERNAME = 'username'
const ROLES = 'roles'
const PERMISSIONS = 'permissions'

const StorageService = {

  setToken(token :any) {
    localStorage.setItem(TOKEN, token);
  },
  getToken() {
    return localStorage.getItem(TOKEN);
  },
  removeToken() {
    localStorage.removeItem(TOKEN);
  },

  setTheme(theme :any) {
    localStorage.setItem(THEME, theme);
  },
  getTheme() {
    return localStorage.getItem(THEME);
  },
  removeTheme() {
    localStorage.removeItem(THEME);
  },

  setUsername(username :any) {
    localStorage.setItem(USERNAME, username);
  },
  getUsername() {
    return localStorage.getItem(USERNAME);
  },
  removeUsername() {
    localStorage.removeItem(USERNAME);
  },

  setRoles(roles :any) {
    localStorage.setItem(ROLES, roles);
  },
  getRoles() {
    return localStorage.getItem(ROLES);
  },
  removeRoles() {
    localStorage.removeItem(ROLES);
  },

  setPermissions(permissions :any) {
    localStorage.setItem(PERMISSIONS, permissions);
  },
  getPermissions() {
    return localStorage.getItem(PERMISSIONS);
  },
  removePermissions() {
    localStorage.removeItem(PERMISSIONS);
  }

}

export default StorageService
