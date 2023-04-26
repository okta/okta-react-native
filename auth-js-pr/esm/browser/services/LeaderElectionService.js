/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { BroadcastChannel, createLeaderElection } from 'broadcast-channel';
import { isBrowser } from '../features.js';

class LeaderElectionService {
    constructor(options = {}) {
        this.started = false;
        this.options = options;
        this.onLeaderDuplicate = this.onLeaderDuplicate.bind(this);
        this.onLeader = this.onLeader.bind(this);
    }
    onLeaderDuplicate() {
    }
    async onLeader() {
        var _a, _b;
        await ((_b = (_a = this.options).onLeader) === null || _b === void 0 ? void 0 : _b.call(_a));
    }
    isLeader() {
        var _a;
        return !!((_a = this.elector) === null || _a === void 0 ? void 0 : _a.isLeader);
    }
    hasLeader() {
        var _a;
        return !!((_a = this.elector) === null || _a === void 0 ? void 0 : _a.hasLeader);
    }
    async start() {
        if (this.canStart()) {
            const { electionChannelName } = this.options;
            this.channel = new BroadcastChannel(electionChannelName);
            this.elector = createLeaderElection(this.channel);
            this.elector.onduplicate = this.onLeaderDuplicate;
            this.elector.awaitLeadership().then(this.onLeader);
            this.started = true;
        }
    }
    async stop() {
        if (this.started) {
            if (this.elector) {
                await this.elector.die();
                this.elector = undefined;
            }
            if (this.channel) {
                this.channel.postInternal = () => Promise.resolve();
                await this.channel.close();
                this.channel = undefined;
            }
            this.started = false;
        }
    }
    requiresLeadership() {
        return false;
    }
    isStarted() {
        return this.started;
    }
    canStart() {
        return isBrowser() && !this.started;
    }
}

export { LeaderElectionService };
//# sourceMappingURL=LeaderElectionService.js.map
