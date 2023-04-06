FROM ruby:3.0

RUN bundle config --global frozen 1

WORKDIR /app/jekyll

COPY Gemfile Gemfile.lock ./

RUN bundle install
