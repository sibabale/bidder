import app, { server } from './app';

const port = process.env.PORT || 3333;
server.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
});

export default app;
