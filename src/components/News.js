import React, { Component } from 'react';
import NewsItem from './NewsItem';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from './Spinner';

export default class News extends Component {
  static defaultProps = {
    pageSize: 5, // default page size to 5
    country: "in",
    category: "general"
  };

  static propTypes = {
    pageSize: PropTypes.number,
    country: PropTypes.string,
    category: PropTypes.string
  };


  capatalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  constructor(props) {
    super(props);
    // console.log("Hello I am a constructor from news component");
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0
    };
    document.title = `${this.capatalizeFirstLetter(this.props.category)} - NewsMonkey`;
  }

  async updateNews() {
    this.props.setProgress(0);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    // console.log(parsedData);
    this.props.setProgress(70);
    this.setState({ 
      articles: parsedData.articles,
      loading: false,
      totalResults: parsedData.totalResults
    });
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.updateNews();
  }

  handleNextClick = async () => {
    // console.log("next");

    this.setState({ page: this.state.page + 1 })
    this.updateNews();

  };

  handlePrevClick = async () => {
    // console.log("prev");

    this.setState({ page: this.state.page - 1 })
    this.updateNews();

  };

  fetchMoreData = async() => {
    this.setState({page: this.state.page + 1})
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    // this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      // loading: false,
      totalResults: parsedData.totalResults
    });
  };

  render() {
    return (
      <>
      {/* // <div className='container my-3'> */}
        <h1 className="text-center">NewsApp - Top {this.capatalizeFirstLetter(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner/>}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
        
        >
        <div className="container">
        <div className="row">
          {this.state.articles.map((element) => {
            return (
              <div className='col-md-4' key={element.url}>
                <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
              </div>
            );
          })}
        
        </div>
        </div>
        
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
          <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
          <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
        </div> */}
      {/* </div > */}

      </>
    );
  }
}
