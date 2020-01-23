const AWS = require('aws-sdk');

class ECSData {

  constructor(region) {
    this.ecs = new AWS.ECS({ region });
  }

  getService({ clusterName, serviceName }) {
    return new Promise((resolve, reject) => {
      const params = {
        cluster: clusterName,
        services: [
          serviceName,
        ],
      };

      this.ecs.describeServices(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        if (data && data.services && data.services.length > 0) {
          resolve(data.services[0]);
        } else {
          // not found
          resolve(null);
        }
      });
    });
  }

  copyService({ serviceCopyName, service, desiredCount = 1, clusterName }) {
    return new Promise((resolve, reject) => {
      const newServiceParams = {
        desiredCount,
        serviceName: serviceCopyName,
        taskDefinition: service.taskDefinition,
        cluster: clusterName,
        deploymentConfiguration: service.deploymentConfiguration,
        loadBalancers: service.loadBalancers,
        placementConstraints: service.placementConstraints,
        placementStrategy: service.placementStrategy,
        role: service.roleArn,
      };

      this.ecs.createService(newServiceParams, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  }
}

module.exports = ECSData;
