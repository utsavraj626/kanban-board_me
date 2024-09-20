// utils/localStorage.js

export const saveViewState = (viewState) => {
    localStorage.setItem('kanbanViewState', JSON.stringify(viewState));
};

export const loadViewState = () => {
    const viewState = localStorage.getItem('kanbanViewState');
    return viewState ? JSON.parse(viewState) : null;
};
