import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployregisterAIGeneratedContent: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("registerAIGeneratedContent", {
    from: deployer,
    args: [],
    log: true,
  });
};

export default deployregisterAIGeneratedContent;

deployregisterAIGeneratedContent.tags = ["registerAIGeneratedContent"];
