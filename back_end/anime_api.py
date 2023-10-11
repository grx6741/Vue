import anipy_cli

class API:
    def __init__(self):
        self.entry = anipy_cli.Entry()
        self.gogo_url = 'https://gogoanime.gg/'

    def getAnime(self, name):
        animes = []

        links_and_names = anipy_cli.query(name, self.entry).get_links()
        if links_and_names != 0:
            links = links_and_names[0]
            names = links_and_names[1]
            for i in range(len(links)):
                ani_name = names[i]
                ani_link = links[i][10:]
                # ani_info = anipy_cli.get_anime_info(self.gogo_url + ani_link)
                animes.append({
                    "name" : ani_name,
                    "link" : ani_link,
                })

        return animes

    def getAnimeInfo(self, link):
        print(link)
        return anipy_cli.get_anime_info(self.gogo_url + 'category/' + link)

if __name__ == '__main__':
    from time import time
    t = time()
    API().getAnime('naruto')
    print(time() - t)
