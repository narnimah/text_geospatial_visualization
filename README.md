## CS5331 Visualization Project II - Text Visualization 

Please click to watch the overview video: https://youtu.be/1Yc1f2Zfgko

Weblink: https://narnimah.github.io/text_geospatial_visualization/index.html

Major Features:

• The project gives a visualization of the texts extracted from news/blogs and classified into 4 categories: people names, locations, organizations, and miscellaneous. Each entry also contains the published time/date of the article/blog.

• We have created a script in R to extract top 50 words from wikinews and huffington news dataset. The dataset is provided as wikinews.tsv and huffington.tsv is preprocessed to remove the tabs, remove url's, punctuation and some stop words and generate it in form of a table with columns source, time, person, location, organization and miscellaneous. The top 50 words are extracted from all categories based on frequencies.

• The user interface was designed using HTML, CSS, D3 and Bootstrap to help users visualize, analyze and get quick insights into frequency of the most commonly used words in articles/blogs over years.

• Firstly we have created the world cloud by considering only the top 50 words that are being read dynamically. Here the user is given the privilege to choose the date range by making use of a slider. Corresponding to the date range selected most popular words in that range is dynamically read from the data and displayed in the cloud. Here the words with higher frequency appear in larger font compared to the lower frequency ones.

• Also we have made sure that on clicking a particular word in the wordle, we have a time series being generated. Here we have made use of stream line graph. This gives user the advantage to see the daily frequency of the word selected over the years. He can also compare it with frequency of other words, by selecting two or more words .In addition we have made sure that when the user hovers the mouse over the time series, we have the term name as well as the frequency being displayed.

• We have also implemented the relationship diagram, here the user is allowed to select a word from the cloud. On clicking on a particular word in cloud, we compute the relationships for that word with 50 other terms that is has been related to most frequently. After computing the relationship, the same is displayed in the form of arc diagram.

• Lastly we highlight patterns from the patterns observed in time series

### Duties of each Member in the Team: 
1. Richard Matovu: Implementing the relationship diagram, pre-processing of data and fine-tuning. 
2. Nikitha Mahesh: Implementing the time series, pre-processsing of data.
3. Bhavya Batra: Working on wordle cloud creation and pre-processing of data.

Software Requirements:
Text Editor: Sublime
Languages used : javascript and D3 
Operating System: windows 10
Server : wamp server



SCREENSHOTS
Home Page 
![ScreenShot](https://github.com/narnimah/text_geospatial_visualization/blob/master/home_1.JPG)

Wordle Cloud generated according to the given date range.
![ScreenShot](https://github.com/narnimah/text_geospatial_visualization/blob/master/home_2.PNG)

We can see the word cloud generated for daily,monthly and yearly.
![ScreenShot](https://github.com/narnimah/text_geospatial_visualization/blob/master/home_3.PNG)

On hovering the mouse over the wordle cloud,the words in the cloud get higlighted.
![ScreenShot](https://github.com/narnimah/text_geospatial_visualization/blob/master/home_4.png)

On clicking on a particular word in the cloud,the time series for the word selected is generated.
![ScreenShot](https://github.com/narnimah/text_geospatial_visualization/blob/master/home_5.PNG)

On hovering the mouse over the time series,we see that the term name and frequency displayed,also it keeps dynamically changing as as we hover over the time range.
![ScreenShot](https://github.com/narnimah/text_geospatial_visualization/blob/master/home_6.png)

On clicking on the relationship button and selecting a word in the cloud.We have the relationship diagram generated. It represents the relationship of the selected word with 50 other words that are most frequently related to it.This happens dynamically.
![ScreenShot](https://github.com/narnimah/text_geospatial_visualization/blob/master/home_7.png)

On hovering over a particular relation in the diagram,the other arcs in the arc diagram become invisble making it easier to fin whivh are the connected words.
![ScreenShot](https://github.com/narnimah/text_geospatial_visualization/blob/master/home_8.png)
