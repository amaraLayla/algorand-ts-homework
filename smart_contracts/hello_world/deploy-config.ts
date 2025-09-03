import { AlgorandClient } from '@algorandfoundation/algokit-utils';
import { HelloWorldFactory } from '../artifacts/hello_world/HelloWorldClient';

async function deploy() {
  console.log('=== Deploying HelloWorld ===');

  const algorand = AlgorandClient.fromConfig({
    algodConfig: {
      server: 'https://testnet-api.algonode.network',
      port: '',
      token: '',
    },
    indexerConfig: {
      server: 'https://testnet-idx.algonode.network',
      port: '',
      token: '',
    },
  });

  const deployer = algorand.account.fromMnemonic(
    "smooth car invite baby clown bone hurdle tower flavor purpose cover furnace defy beef avoid unable slide dynamic group coin lift stem title ability leopard"
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
    args: { github: 'olivestrings' },
  });

  console.log(`✅ Stored GitHub handle 'olivestrings' in box 'github'`);
  console.log(`✅ Called hello with name = world, received: ${response.return}`);
  console.log(`✅ Deployed HelloWorld with App ID: ${appClient.appId}`);
}

deploy().catch((err) => {
  console.error('Deployment failed:', err);
});
