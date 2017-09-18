import { Component } from '@angular/core';
import { Api } from '../../../shared/services/api/api.service';
import { Broadcaster } from '../../../shared/types/Broadcaster';
import { TranslationService } from '../../../shared/services/translation.service';


@Component({
    selector: 'translationExample',
    templateUrl: './translation.component.html',
    providers: [Api, Broadcaster, TranslationService]
})
export class TranslationComponent {
    static CHANGE_LANGUAGE: string = 'CHANGE_LANGUAGE';

    private translations: Map<string, string> = new Map();
    private text: string;

    constructor(private eventDispatcher: Broadcaster, private t: TranslationService) {
        this.translations = TranslationService.all();
    }

    public translate(txt): string {
        return this.translations.get(txt);
    }

    public changeLanguage(lang: string): void {
        this.t.lang(lang);
        this.text = lang;
        this.translations = TranslationService.all();
        this.eventDispatcher.broadcast(TranslationComponent.CHANGE_LANGUAGE, lang);
    }
}
