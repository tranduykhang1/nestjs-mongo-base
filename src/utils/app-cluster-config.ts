import { Injectable } from '@nestjs/common';
import cluster from 'cluster';
import * as os from 'os';
import { appConfig } from 'src/app.config';
const numCPUs = os.cpus().length;

@Injectable()
export class AppClusterConfig {
  static enabled(callback: any): void {
    const maxWorker = appConfig.maxWorkers || 2;
    let workers: any = maxWorker;
    if (numCPUs < +maxWorker) {
      workers = numCPUs;
    }
    if (cluster?.isPrimary) {
      for (let i = 0; i < workers; i++) {
        cluster.fork();
      }
      cluster.on('exit', () => {
        cluster.fork();
      });
    } else {
      callback();
    }
  }
}
