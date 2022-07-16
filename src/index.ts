import * as playwright from 'playwright-chromium';
import { Props, RessourceProps } from './types';

const HOME_PAGE = 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement';

const run = async (props: Props) => {
    const browserType = 'chromium';

    const playWrightOptions = { headless: true };

    const browser = await playwright[browserType].launch(playWrightOptions);

    const page = await browser.newPage();

    await page.goto(HOME_PAGE);

    // Click on 'Commencer'
    const commencerButton = await page.waitForSelector('button[id="btn-commencer"]');
    await commencerButton.click();

    // Code Postal
    const codePostalInput = await page.waitForSelector('input[id="codePostal"]');
    await codePostalInput.fill(props.codePostal || '75009');

    // Select first match
    await page.waitForSelector('li[class="uib-typeahead-match"]');
    await page.keyboard.press('Enter');

    const typeResidenceButton = await page.waitForSelector(`label[for="nature_${props.typeResidence.residence}"]`);
    await typeResidenceButton.click();

    switch (props.typeResidence.residence) {
        case 'APPARTEMENT_OU_MAISON': {
            const typeAppartementOuMaisonButton = await page.waitForSelector(
                `label[for="statut_${props.typeResidence.type}"]`
            );
            await typeAppartementOuMaisonButton.click();
            break;
        }
        case 'LOGEMENT_CROUS': {
            const typeCrousButton = await page.waitForSelector(`label[for="typeLocal_${props.typeResidence.type}"]`);
            await typeCrousButton.click();
            break;
        }
        case 'FOYER':
            break;
        case 'CHAMBRE':
            break;
        case 'RESIDENCE_SOCIALE_FJT':
            break;
        case 'MAISON_RETRAITE_EHPAD':
            break;
    }

    if ('meublee' in props.typeResidence) {
        const meublee = props.typeResidence.meublee;
        const meubleButton = await page.waitForSelector(`label[for="estMeuble_${String(meublee)}"]`);
        await meubleButton.click();
    }

    // Loyer mensuel
    const loyerMensuelInput = await page.waitForSelector('input[name="montantLoyer"]');
    await loyerMensuelInput.fill(props.loyer.toString());

    // Seul ou Couple
    const seulOuCouple = props.situationFamiliale.ressourceConjoint ? 'COUPLE' : 'SEUL';
    const seulButton = await page.waitForSelector(`label[for="situationFamiliale_${seulOuCouple}"]`);
    await seulButton.click();

    // Nombre d'enfants
    if (props.situationFamiliale.enfants > 20) {
        throw new Error('Impossible to have more than 20 children');
    }
    const plusButton = await page.waitForSelector('button:has-text("+")');
    for (let i = 0; i < props.situationFamiliale.enfants; i++) {
        await plusButton.click();
    }

    await fillRessource(page, 'allocataire', props.situationFamiliale.ressourceAllocataire);
    if (props.situationFamiliale.ressourceConjoint) {
        await fillRessource(page, 'conjoint', props.situationFamiliale.ressourceConjoint);
    }

    // Continuer
    const continuerButton = await page.waitForSelector('button[id="btn-suivant"]');
    await continuerButton.click();

    // Récupérer le montant
    await page.waitForSelector('section[id="resultat"]');
    const result = await page.$('text=/\\d+€ par mois/');

    console.log(parseInt((await result?.textContent()) || '0', 10));

    await browser.close();
};

const fillRessource = async (page: playwright.Page, type: 'allocataire' | 'conjoint', ressource: RessourceProps) => {
    let totalIncomes = 0;

    switch (ressource.type) {
        case 'sans': {
            const sansButton = await page.waitForSelector(`button[id="${type}_siAucunRevenu"]`);
            await sansButton.click();
            break;
        }
        case 'avec': {
            if (ressource.salaires) {
                totalIncomes += ressource.salaires;
                const salairesButton = await page.waitForSelector(`button[id="${type}_siSalaire"]`);
                await salairesButton.click();
                const salairesInput = await page.waitForSelector(`input[id="ressource${type}_SALAIRE"]`);
                await salairesInput.fill(ressource.salaires.toString());
            }
            if (ressource.allocationsChomagePreretraite) {
                totalIncomes += ressource.allocationsChomagePreretraite;
                const allocationsChomagePreretraiteButton = await page.waitForSelector(
                    `button[id="${type}_siAllocation"]`
                );
                await allocationsChomagePreretraiteButton.click();
                const allocationsChomagePreretraiteInput = await page.waitForSelector(
                    `input[id="ressource${type}_ALLOCATION_CHOMAGE"]`
                );
                await allocationsChomagePreretraiteInput.fill(ressource.allocationsChomagePreretraite.toString());
            }
            if (ressource.retraitesPensions) {
                totalIncomes += ressource.retraitesPensions;
                const retraitesPensionsButton = await page.waitForSelector(`button[id="${type}_siRetraite"]`);
                await retraitesPensionsButton.click();
                const retraitesPensionsInput = await page.waitForSelector(
                    `input[id="ressource${type}_RETRAITE_PENSION_IMPOSABLE"]`
                );
                await retraitesPensionsInput.fill(ressource.retraitesPensions.toString());
            }
            if (ressource.pensionAlimentaireRecue) {
                totalIncomes += ressource.pensionAlimentaireRecue;
                const pensionAlimentaireRecueButton = await page.waitForSelector(`button[id="${type}_siPension"]`);
                await pensionAlimentaireRecueButton.click();
                const pensionAlimentaireRecueInput = await page.waitForSelector(
                    `input[id="ressource${type}_PENSION_ALIMENTAIRE_RECUE"]`
                );
                await pensionAlimentaireRecueInput.fill(ressource.pensionAlimentaireRecue.toString());
            }
            if (ressource.revenuOuDeficitTravailleurIndependantNmoins2) {
                totalIncomes += ressource.revenuOuDeficitTravailleurIndependantNmoins2;
                const revenuOuDeficitTravailleurIndependantNmoins2Button = await page.waitForSelector(
                    `button[id="${type}_siRti"]`
                );
                await revenuOuDeficitTravailleurIndependantNmoins2Button.click();
                const revenuOuDeficitTravailleurIndependantNmoins2Input = await page.waitForSelector(
                    `input[id="ressource${type}_REVENU_TRAVAILLEUR_INDEPENDANT"]`
                );
                await revenuOuDeficitTravailleurIndependantNmoins2Input.fill(
                    ressource.revenuOuDeficitTravailleurIndependantNmoins2.toString()
                );
            }
        }
    }

    if (totalIncomes >= 15000 !== (ressource.status === undefined)) {
        throw new Error('Impossible to add a status when the total amount of the incomes is greater than 15000');
    }
    if (ressource.status) {
        const statusButton = await page.waitForSelector(
            `cnaf-personne[profil="'${type.toUpperCase()}'"] >> label[for="aucunRevenu${ressource.status}"]`
        );
        await statusButton.click();
    }
};

const test: Props = {
    codePostal: '75009',
    typeResidence: {
        residence: 'APPARTEMENT_OU_MAISON',
        type: 'LOCATION',
        meublee: true,
    },
    loyer: 1190,
    situationFamiliale: {
        enfants: 0,
        ressourceAllocataire: {
            type: 'avec',
            salaires: 2000,
            status: 'ETUDIANT_NON_BOURSIER',
        },
    },
};

run(test).catch((err) => {
    console.error(err);
    process.exit(1);
});
