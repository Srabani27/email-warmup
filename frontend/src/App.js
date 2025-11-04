import React, { useEffect, useState } from 'react';
import { Button, Container, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { startOne, getLogs, addAccount } from './api';

function App() {
  const [logs, setLogs] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function loadLogs(){ const r = await getLogs(); setLogs(r.data); }
  useEffect(()=>{ loadLogs(); const id = setInterval(loadLogs, 15000); return ()=>clearInterval(id); }, []);

  return (
    <Container>
      <h2>Email Warm-up Dashboard</h2>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <TextField label="Password" value={password} type="password" onChange={e=>setPassword(e.target.value)} />
        <Button
  onClick={async () => {
    if (!email || !password) {
      alert("Email and Password required");
      return;
    }

    try {
      await addAccount({ email, password });
      setEmail('');
      setPassword('');
      loadLogs();
      alert("Account added ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  }}
>
  Add Account
</Button>

        <Button variant="contained" onClick={async ()=>{ await startOne(); loadLogs(); }}>Send One</Button>
      </div>

      <Table>
        <TableHead>
          <TableRow><TableCell>Sender</TableCell><TableCell>Receiver</TableCell><TableCell>Status</TableCell><TableCell>Timestamp</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {logs.map(l => (
            <TableRow key={l.id}><TableCell>{l.sender}</TableCell><TableCell>{l.receiver}</TableCell><TableCell>{l.status}</TableCell><TableCell>{l.timestamp}</TableCell></TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default App;
