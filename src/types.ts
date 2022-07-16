export interface Props {
    codePostal: string;
    typeResidence: TypeResidenceProps;
    loyer: number; // Between 0 and 3000
    situationFamiliale: SituationFamilialeProps;
}

export type TypeResidenceProps =
    | TypeAppartementOuMaisonProps
    | TypeCrousProps
    | TypeFoyer
    | TypeChambre
    | TypeResidenceSocialeFJTProps
    | TypeMaisonDeRetraiteEHPADProps;

export interface TypeAppartementOuMaisonProps extends MeubleeProps {
    residence: 'APPARTEMENT_OU_MAISON';
    type: 'LOCATION' | 'COLOCATION';
}

export interface TypeCrousProps {
    residence: 'LOGEMENT_CROUS';
    type: 'CHAMBRE' | 'CHAMBRE_REHABILITEE' | 'STUDIO';
}

export interface TypeFoyer {
    residence: 'FOYER';
}

export interface TypeChambre extends MeubleeProps {
    residence: 'CHAMBRE';
}

export interface TypeResidenceSocialeFJTProps {
    residence: 'RESIDENCE_SOCIALE_FJT';
}

export interface TypeMaisonDeRetraiteEHPADProps {
    residence: 'MAISON_RETRAITE_EHPAD';
}

export interface MeubleeProps {
    meublee: boolean;
}

export interface SituationFamilialeProps {
    enfants: number; // Between 0 and 20
    ressourceAllocataire: RessourceProps;
    ressourceConjoint?: RessourceProps;
}

export type RessourceProps = SansRessourceProps | AvecRessourceProps;

export interface SansRessourceProps {
    type: 'sans';
    status: 'RSA' | 'ETUDIANT_NON_BOURSIER' | 'ETUDIANT_BOURSIER' | 'AUTRE_SITUATION';
}

export interface AvecRessourceProps {
    type: 'avec';
    salaires?: number;
    allocationsChomagePreretraite?: number;
    retraitesPensions?: number;
    pensionAlimentaireRecue?: number;
    revenuOuDeficitTravailleurIndependantNmoins2?: number;
    status?: 'RSA' | 'ETUDIANT_NON_BOURSIER' | 'ETUDIANT_BOURSIER' | 'AUTRE_SITUATION'; // Only asked if the sum of the incomes is strictly less than 15000
}
