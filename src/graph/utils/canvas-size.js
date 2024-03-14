const getCanvasSize = (w=1, h=1) => {
    const width = (window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth) * w;
    const height = (window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight) * h;
    return { width, height };
};

export { getCanvasSize };