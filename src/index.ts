import * as playwright from 'playwright-chromium';

const HOME_PAGE = 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement';

interface Props {
    codePostal?: string;
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
    const commencerButton = await page.waitForSelector('button[id="btn-commencer"]');
    await commencerButton.click();

    // ZIP code
    const codePostalInput = await page.waitForSelector('input[id="codePostal"]');
    await codePostalInput.fill(props.codePostal || '75009');

    // Select first match
    await page.waitForSelector('li[class="uib-typeahead-match"]');
    await page.keyboard.press('Enter');

    // Type
    const appartementOuMaisonButton = await page.waitForSelector('label[for="nature_APPARTEMENT_OU_MAISON"]');
    await appartementOuMaisonButton.click();

    // Type
    const locationButton = await page.waitForSelector('label[for="statut_LOCATION"]');
    await locationButton.click();

    // Meublé
    const meubleButton = await page.waitForSelector('label[for="estMeuble_true"]');
    await meubleButton.click();

    // Loyer mensuel (avec charge)
    const loyerMensuelInput = await page.waitForSelector('input[name="montantLoyer"]');
    await loyerMensuelInput.fill(props.loyerMensuel || '1190');

    // Situation familiale
    const seulButton = await page.waitForSelector('label[for="situationFamiliale_SEUL"]');
    await seulButton.click();

    // Nombre d'enfants

    // Revenus
    const salaireButton = await page.waitForSelector('button[id="allocataire_siSalaire"]');
    await salaireButton.click();

    const salaireInput = await page.waitForSelector('input[id="ressourceallocataire_SALAIRE"]');
    await salaireInput.fill(props.salaire || '2000');

    const nonBoursierButton = await page.waitForSelector('label[for="aucunRevenuETUDIANT_NON_BOURSIER"]');
    await nonBoursierButton.click();

    // Continuer
    const continuerButton = await page.waitForSelector('button[id="btn-suivant"]');
    await continuerButton.click();

    // Récupérer le montant
    await page.waitForSelector('div[class="row mise-en-avant-fond-cnaf"]');
    const element = await page.locator('text=/\\d+€ par mois/');
    console.log(parseInt(await element.textContent() || '', 10));

    await browser.close();
};

run({}).catch((err) => {
    console.error(err);
    process.exit(1);
});
