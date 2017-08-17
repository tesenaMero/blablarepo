/*
    {
      "contactId": 594,
      "contactCode": "9590000731",
      "name": "Nicolae Gheorgheoiu",
      "countryAreaCode": "US",
      "phone": "0012345678",
      "email": "e-ngheorgheoiu@neoris.com",
      "contactRole": {
        "contactRoleDesc": "1"
      },
      "isPrimaryContact": true
    }
*/

interface JobsiteContact {
  contactId: number;
  contactCode: string;
  name: string;
  countryAreaCode: string;
  phone: string;
  email: string;
  contactRole: {
    contactRoleDesc: string;
  };
  isPrimaryContact: boolean;
}

export default JobsiteContact;
