import React, { useState } from 'react';
import { MenuItem, FormControl, Select, Button, InputLabel, Box } from '@mui/material';

import './contact.css';
import { useParams } from 'react-router';

const emails = [
  "user1@example.com",
  "user2@example.com",
  "user3@example.com",
  "user4@example.com",
  "user5@example.com"
];

const organizations = [
  { name: "Nonprofit A", email: "contact@nonprofitA.org" },
  { name: "Charity B", email: "info@charityB.com" },
  { name: "Foundation C", email: "hello@foundationC.net" }
];

function Contact() {
  const { id } = useParams();
  const [selectedEmail, setSelectedEmail] = useState('');

  const handleChange = (event) => {
    setSelectedEmail(event.target.value);
  };

  const handleEmailOrganization = (orgEmail) => {
    // Placeholder for email logic
    console.log(`Emailing ${orgEmail} from ${selectedEmail}`);
    alert(`An email would be sent to ${orgEmail} from ${selectedEmail}`);
  };

  return (
   <div className='contact-container'>
      <h1>Find Someone to Help</h1>

      <Box>
      <FormControl fullWidth>
        <InputLabel id="email-select-label">Organization Email</InputLabel>
        <Select
          labelId="email-select-label"
          id="email-select"
          value={selectedEmail}
          label="Your Email"
          onChange={handleChange}
        >
          {emails.map(email => (
            <MenuItem key={email} value={email}>{email}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>

   </div>
  );
}

export default Contact;
