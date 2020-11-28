# Serverless Functions for DiceBear Avatars [Beta]

Clone the repository:

```
git clone -b v4 git@github.com:DiceBear/avatars.git
```

Go to the Serverless directory:

```
cd avatars/serverless
```

Install the dependencies:

```
npm install
```

Build the functions:

```
npm run build
```

[Create an account](https://cloud.ibm.com/registration) for the IBM cloud. No credit card is required for the free account.

[Install the IBM Cloud CLI](https://cloud.ibm.com/docs/cli?topic=cli-install-ibmcloud-cli) and then log in using it:

```
ibmcloud login --sso
```

Configure the resource group. See also: https://cloud.ibm.com/docs/account?topic=cli-ibmcloud_commands_resource

```
ibmcloud resource groups
ibmcloud target -g <RESOURCE_GROUP>
```

Create a functions namespace:

```
ibmcloud fn namespace create <NAMESPACE>
ibmcloud fn namespace target <NAMESPACE>
```

Now you can start the deployment:

```
npm run deploy
```
