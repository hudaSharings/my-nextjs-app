export type SessionPayload= {
  userId: string;
  user:{    
    name: string;
    OrgIg: string;
  };  
  expiresAt: Date;
};
