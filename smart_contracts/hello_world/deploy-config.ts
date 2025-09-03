import { AlgorandClient } from '@algorandfoundation/algokit-utils';
import { HelloWorldFactory } from '../artifacts/hello_world/HelloWorldClient';

async function deploy() {
  console.log('=== Deploying HelloWorld ===');

  const algorand = AlgorandClient.fromEnvironment();
  const deployer = algorand.account.fromMnemonic(
    "boost noodle rice love ranch sauce palm bright peasant feel toe trap cheap message fabric diagram wasp tail empower saddle cruise blue since abstract proud"
  );

  const factory = algorand.client.getTypedAppFactory(HelloWorldFactory, {
    defaultSender: deployer.addr,
  });

  const { appClient, result } = await factory.deploy({
    onUpdate: 'append',
    onSchemaBreak: 'append',
  });

  if (['create', 'replace'].includes(result.operationPerformed)) {
    await algorand.send.payment({
      amount: (1).algo(),
      sender: deployer.addr,
      receiver: appClient.appAddress,
    });
  }

  const response = await appClient.send.hello({
    args: { name: 'world' },
  });

  await appClient.send.deposit({
    args: { github: 'Edda-Ignite' },
  });

  console.log(`✅ Stored GitHub handle 'Edda-Ignite' in box 'github'`);
  console.log(`✅ Called hello with name = world, received: ${response.return}`);
  console.log(`✅ Deployed HelloWorld with App ID: ${appClient.appId}`);
}

// ✅ Call the function outside its definition
deploy().catch((err) => {
  console.error('Deployment failed:', err);
});
