  export type typeItem = {
    name: string,
    loc: string,
    time: Date,
    colors?: string[],
    straits?: string[],
    owner?: {
      name?: string,
      tel?: string,
      ID?: string,
    },
    page_id: string,
    game_matches? : number
    id?: string,
    image_url?: string,
  };