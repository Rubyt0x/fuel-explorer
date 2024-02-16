import { Context } from '../core/GraphQLServer';
import { inngest } from '../core/Inngest';
import { GQLBlock } from '../generated/types';
import { PaginatorParams } from '../helpers/Paginator';
import { PromiseHelper } from '../helpers/Promise';
import { BlockRepository } from '../repositories/BlockRepository';

export type CreatedBlock = {
  blockId: number;
  block: GQLBlock;
};

export class BlockDomain {
  async syncBlocks(page: number, perPage: number) {
    const repository = new BlockRepository();
    const { blocks, hasNext } = await repository.blocksFromNode(page, perPage);
    const created = await repository.insertMany(blocks);

    await PromiseHelper.executeInQueue(created, async (block) => {
      await inngest.syncTransactions(block);
    });

    return { blocks, hasNext };
  }

  createResolvers() {
    return {
      Query: {
        blocks: this.blocks,
      },
    };
  }

  async blocks(_ctx: Context, params: PaginatorParams) {
    const repository = new BlockRepository();
    return repository.findMany(params);
  }
}
