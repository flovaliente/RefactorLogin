import app from './app.js';
import { init } from './socket.js';

const PORT = 8080;
const serverHttp = app.listen(PORT, () =>{
  console.log(`Server running in http://localhost:${PORT}/`);
});

init(serverHttp)