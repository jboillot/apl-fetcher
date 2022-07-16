import * as playwright from 'playwright-chromium';

const HOME_PAGE = 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement';

interface Props {
    zipCode?: string;
    loyerMensuel?: string;
    salaire?: string;
}

const run = async (props: Props) => {
    const browserType = 'chromium';

    const playWrightOptions = { headless: true };

    const browser = await playwright[browserType].launch(playWrightOptions);

    const page = await browser.newPage();

    await page.goto(HOME_PAGE);

    // Click on 'Commencer'
    await page.waitForSelector('button[id="btn-commencer"]');
    await page.click('button[id="btn-commencer"]');

    // ZIP code
    await page.waitForSelector('input[id="codePostal"]');
    await page.fill('input[id="codePostal"]', props.zipCode || '75009');

    // Select first match
    await page.waitForSelector('li[class="uib-typeahead-match"]');
    await page.keyboard.press('Enter');

    // Type
    await page.waitForSelector('label[for="nature_APPARTEMENT_OU_MAISON"]');
    await page.click('label[for="nature_APPARTEMENT_OU_MAISON"]');

    // Type
    await page.waitForSelector('label[for="statut_LOCATION"]');
    await page.click('label[for="statut_LOCATION"]')

    // Meublé
    await page.waitForSelector('label[for="estMeuble_true"]');
    await page.click('label[for="estMeuble_true"]');

    // Loyer mensuel (avec charge)
    await page.waitForSelector('input[name="montantLoyer"]');
    await page.fill('input[name="montantLoyer"]', props.loyerMensuel || '1190');

    // Situation familiale
    await page.waitForSelector('label[for="situationFamiliale_SEUL"]');
    await page.click('label[for="situationFamiliale_SEUL"]');

    // Nombre d'enfants

    // Revenus
    await page.waitForSelector('button[id="allocataire_siSalaire"]');
    await page.click('button[id="allocataire_siSalaire"]');

    await page.waitForSelector('input[id="ressourceallocataire_SALAIRE"]');
    await page.fill('input[id="ressourceallocataire_SALAIRE"]', props.salaire || '2000');

    await page.waitForSelector('label[for="aucunRevenuETUDIANT_NON_BOURSIER"]');
    await page.click('label[for="aucunRevenuETUDIANT_NON_BOURSIER"]');

    // Continuer
    await page.waitForSelector('button[id="btn-suivant"]');
    await page.click('button[id="btn-suivant"]');

    // Récupérer le montant
    await page.waitForSelector('div[class="row mise-en-avant-fond-cnaf"]');
    const element = await page.locator('text=/\\d+€ par mois/');
    console.log(parseInt(await element.textContent() || '', 10));
};

run({}).catch((err) => console.error(err));
