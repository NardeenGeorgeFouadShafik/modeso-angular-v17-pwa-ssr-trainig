import { Component, Inject, OnInit, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  install() {
    if (isPlatformBrowser(this.platformId)) {
      this.promptEvent.prompt();
    }
  }
  promptEvent: any;
  webPushKeys = {
    publicKey:
      'BG7qSwfay7Bwn-gpfi3WszImt7XDtqyzYQLuQNTVfDqP-dJ4nEf80c9kCnAo8DpQD5QKdPd2t6ambpQn4NRdWdM',

    privateKey: 'DqVDdoVXJlEqujS420FpVLRcZ2E0_-qjwKUu4NiVAVM',
  };
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private http: HttpClient,
  ) {
    this.swUpdate.versionUpdates.subscribe(async (evt) => {
      console.log('UpdateService: versionUpdates', evt);
      switch (evt.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${evt.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          console.log(
            `New app version ready for use: ${evt.latestVersion.hash}`
          );
          await swUpdate.activateUpdate();
          location.reload();
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(
            `Failed to install app version '${evt.version.hash}': ${evt.error}`
          );
          break;
      }
    });
    if (isPlatformBrowser(platformId)) {
      window.addEventListener('beforeinstallprompt', (event) => {
        this.promptEvent = event;
      });
    }
  }
  send(): void {
    this.http
      .post('http://localhost:4000/api/send-newsletter', null)
      .subscribe(() => {
        console.log('news');
      });

  }
  async ngOnInit(): Promise<void> {
    const sub = await this.swPush.requestSubscription({
      serverPublicKey: this.webPushKeys.publicKey
    });
    console.log(sub);
    this.http
      .post('http://localhost:4000/api/notifications', sub)
      .subscribe(() => console.log('subscribtion requested'));
  }
  title = 'modeso-angular-v17-pwa-ssr-trainig';
}
