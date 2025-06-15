
const PROJECT_REF = "hpgpjnsmplqeatpmtqna";
const SESSION_KEY = `sb-${PROJECT_REF}-auth-token`;

export const persistSessionToLocalStorage = () => {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session) {
        localStorage.setItem(SESSION_KEY, session);
    }
};

export const loadSessionFromLocalStorage = () => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
        sessionStorage.setItem(SESSION_KEY, session);
    }
};

export const clearSessionFromLocalStorage = () => {
    localStorage.removeItem(SESSION_KEY);
};
